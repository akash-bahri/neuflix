from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import pickle, os
import numpy as np
import pandas as pd
import requests
import logging

from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('TMDB_API_KEY')


# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the Pickle files
def load_pickle_files():
    model_folder = os.path.join(os.path.dirname(__file__), '..', '..', 'Model')  # Go up two levels to the Model folder

    user_item_matrix_path = os.path.join(model_folder, 'user_item_matrix.pkl')
    item_similarity_matrix_path = os.path.join(model_folder, 'item_similarity_matrix.pkl')

    # Load the pickle files
    with open(user_item_matrix_path, 'rb') as f:
        user_item_matrix = pickle.load(f)

    with open(item_similarity_matrix_path, 'rb') as f:
        item_similarity_matrix = pickle.load(f)

    return user_item_matrix, item_similarity_matrix

# Load the user-item matrix and item similarity matrix
user_item_matrix, item_similarity_matrix = load_pickle_files()


links_df = pd.read_csv('../../Dataset/links.csv')
movie_to_tmdb = dict(zip(links_df['movieId'], links_df['tmdbId']))

movies_df = pd.read_csv('../../Dataset/movies.csv')
# Create a dictionary to map movieId to title and genres
movie_info = {row['movieId']: {'title': row['title'], 'genres': row['genres'].split('|')} for _, row in movies_df.iterrows()}

rating_df = pd.read_csv('../../Dataset/ratings.csv')
rating_df = rating_df.rename(columns={'userId': 'UID', 'movieId': 'MID', 'rating': 'rating'})

# Function to predict movie rating
def predict_rating(user_id, movie_id, k=5):
    if movie_id not in item_similarity_matrix or user_id not in user_item_matrix:
        return None

    # Get the ratings of the user
    user_ratings = user_item_matrix[user_id]
    rated_movies = {movie: rating for movie, rating in user_ratings.items() if rating > 0}

    # Get similarity scores for the target movie
    similar_scores = item_similarity_matrix[movie_id]
    
    # Filter to only similar movies that the user has rated
    similar_rated = {movie: similar_scores[movie] for movie in rated_movies.keys() if movie in similar_scores}

    # Take top K similar rated movies
    top_k = sorted(similar_rated.items(), key=lambda x: x[1], reverse=True)[:k]

    # Weighted average
    weighted_sum = sum([user_ratings[movie] * score for movie, score in top_k])
    sum_of_weights = sum([abs(score) for _, score in top_k])

    if sum_of_weights == 0:
        return None
    
    return weighted_sum / sum_of_weights

# Route for movie recommendations
@app.route('/api/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    recommended_movies = []

    for movie_id in user_item_matrix[user_id].keys():
        predicted_rating = predict_rating(user_id, movie_id)
        if predicted_rating is not None:
            # Get the movie title and genres using the movie_info dictionary
            movie_details = movie_info.get(movie_id, {'title': 'Unknown', 'genres': []})
            
            recommended_movies.append({
                'movie_id': movie_id,
                'predicted_rating': predicted_rating,
                'title': movie_details['title'],
                'genres': movie_details['genres']
            })

    recommended_movies = sorted(recommended_movies, key=lambda x: x['predicted_rating'], reverse=True)[:10]

    return jsonify(recommended_movies)


    # Route to get movie posters from TMDB API
@app.route('/api/movie/<int:movie_id>/poster', methods=['GET'])
def get_movie_poster(movie_id):
    # Step 1: Get the tmdbId from the movieId using the movie_to_tmdb dictionary
    if movie_id not in movie_to_tmdb:
        return jsonify({'error': 'Movie ID not found in the mapping'}), 404
    
    tmdb_id = movie_to_tmdb[movie_id]
    
    # Step 2: Fetch the poster using the tmdbId
    

    url = f'https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={api_key}'
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        data = response.json()

        # Log the raw response to see if it's returning the expected data
        logging.debug(f"TMDB API response for movie {movie_id} (tmdbId: {tmdb_id}): {data}")

        # Check if the poster_path exists in the response
        if 'poster_path' in data and data['poster_path']:
            poster_url = f'https://image.tmdb.org/t/p/original{data["poster_path"]}'
            return jsonify({'poster_url': poster_url})

        logging.error(f"No poster found for movie {movie_id}.")
        return jsonify({'error': 'Poster not found'}), 404
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching poster for movie {movie_id} (tmdbId: {tmdb_id}): {e}")
        return jsonify({'error': 'Error fetching poster'}), 500

from tensorflow.keras.models import load_model

# Load encoder and cluster data
encoder = load_model('../../Model/ghrs_encoder.h5')
df_user_clustered = pd.read_pickle('../../Model/user_clusters.pkl')
user_embeddings = np.load('../../Model/user_embeddings.npy')

@app.route('/api/cluster_recommendations/<int:user_id>', methods=['GET'])
def get_cluster_recommendations(user_id):
    if user_id not in df_user_clustered['UID'].values:
        return jsonify({'error': 'User not found'}), 404

    # Get user cluster
    user_cluster = df_user_clustered[df_user_clustered['UID'] == user_id]['cluster'].values[0]

    # Load movie ratings
      # or wherever your ratings are

    # Merge in cluster info
    df_clustered = rating_df.merge(df_user_clustered, on='UID')

    # Filter to users in the same cluster
    cluster_users = df_clustered[df_clustered['cluster'] == user_cluster]

    # Recommend top-rated movies in the cluster
    movie_scores = cluster_users.groupby('MID').agg({'rating': ['mean', 'count']})
    movie_scores.columns = ['avg_rating', 'rating_count']
    movie_scores = movie_scores.reset_index()
    movie_scores = movie_scores.sort_values(by=['avg_rating', 'rating_count'], ascending=False)

    # Filter out movies the user has already rated
    user_rated = rating_df[rating_df['UID'] == user_id]['MID'].tolist()
    recommended = movie_scores[~movie_scores['MID'].isin(user_rated)].head(10)

    # Attach titles
    recommended = recommended.merge(movies_df, left_on='MID', right_on='movieId', how='left')

    return jsonify([
        {
            'movie_id': row['MID'],
            'predicted_rating': round(row['avg_rating'], 2),
            'title': row['title'],
            'genres': row['genres'].split('|')
        }
        for _, row in recommended.iterrows()
    ])

@app.route('/api/movies/latest', methods=['GET'])
def get_latest_movies():

   

    url = f'https://api.themoviedb.org/3/movie/now_playing?api_key={api_key}&language=en-US&page=1'

    try:
        response = requests.get(url)
        data = response.json()
        results = data.get('results', [])[:10]

        formatted_movies = []
        for movie in results:
            formatted_movies.append({
                'movie_id': movie['id'],  # TMDB ID here, won't map to your dataset directly
                'title': movie['title'],
                'genres': [],  # Optional: fetch genre names using genre_ids if needed
                'release_date': movie.get('release_date'),
                'poster_url': f'https://image.tmdb.org/t/p/w1280{movie["poster_path"]}' if movie.get('poster_path') else None,
                'backdrop_url': f'https://image.tmdb.org/t/p/w1280{movie["backdrop_path"]}' if movie.get('backdrop_path') else None,
                'imdb_id': None  # Optional: can be added with another API call
            })

        return jsonify(formatted_movies)

    except Exception as e:
        print('TMDB Now Playing error:', e)
        return jsonify({'error': 'Failed to fetch latest movies'}), 500


@app.route('/api/movies/genre/<genre>', methods=['GET'])
def get_movies_by_genre(genre):
    filtered = [
        (mid, details)
        for mid, details in movie_info.items()
        if genre in details['genres']
    ][:30]  # Hard limit upfront

    result = []
    for movie_id, details in filtered:
        tmdb_id = movie_to_tmdb.get(movie_id)
        if not tmdb_id:
            continue

        try:
            url = f'https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={api_key}'
            res = requests.get(url)
            data = res.json()
            if data.get('poster_path'):
                result.append({
                    'movie_id': movie_id,
                    'title': details['title'],
                    'genres': details['genres'],
                    'poster_url': f'https://image.tmdb.org/t/p/original{data["poster_path"]}'
                })
        except:
            continue

        if len(result) >= 10:
            break

    return jsonify(result)



@app.route('/api/rate', methods=['POST'])
def rate_movie():
    data = request.get_json()
    user_id = data['user_id']
    movie_id = data['movie_id']
    rating = data['rating']

    # Create new entry with internal column names
    new_rating = pd.DataFrame([{
        'UID': user_id,
        'MID': movie_id,
        'rating': rating
    }])

    global rating_df
    rating_df = pd.concat([rating_df, new_rating], ignore_index=True)

    # 💾 Save to CSV with original column names to avoid header corruption
    def save_ratings():
        export_df = rating_df.rename(columns={'UID': 'userId', 'MID': 'movieId'})
        export_df.to_csv('../../Dataset/ratings.csv', index=False)

    save_ratings()

    return jsonify({'message': 'Rating saved'}), 200

@app.route('/api/user_ratings/<int:user_id>', methods=['GET'])
def get_user_rated_movies(user_id):
    # Get page params
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    start = (page - 1) * per_page
    end = start + per_page

    rated = rating_df[rating_df['UID'] == user_id]
    total = len(rated)

    results = []
    for _, row in rated.iloc[start:end].iterrows():
        mid = row['MID']
        rating = row['rating']
        movie_details = movie_info.get(mid, {'title': 'Unknown', 'genres': []})
        tmdb_id = movie_to_tmdb.get(mid)
        if not tmdb_id:
            continue

        try:
            url = f'https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={api_key}'
            res = requests.get(url)
            data = res.json()
            poster_url = f'https://image.tmdb.org/t/p/original{data["poster_path"]}' if data.get('poster_path') else None
            results.append({
                'movie_id': mid,
                'title': movie_details['title'],
                'genres': movie_details['genres'],
                'poster_url': poster_url,
                'rating': rating
            })
        except:
            continue

    return jsonify({
        'results': results,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    })


if __name__ == '__main__':
    app.run(debug=True)