npm run build
docker build . -t noteapp:frontend
docker tag noteapp:frontend carlme96/noteapp:frontend
docker push carlme96/noteapp:frontend