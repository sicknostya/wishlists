# wishlists-react-django

## for frontend:

- install node.js 22.12.0
- cd frontend
- npm i
- npm start

app will starts at http://localhost:3000

## for docker:

- docker-compose up

app will starts at http://localhost:8000/

## other (for dev):

- docker compose exec backend python manage.py loaddata wishlist/mock_wishlists.json

- docker-compose down
- docker-compose build
- docker-compose up -d

- docker compose exec backend python manage.py createsuperuser

- docker compose exec backend python manage.py makemigrations
- docker compose exec backend python manage.py migrate

python manage.py createsuperuser

python manage.py makemigrations
python manage.py migrate
