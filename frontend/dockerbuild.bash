npm run build
docker build . -t noteapp:frontend-v1.2
docker tag noteapp:frontend-v1.2 carlme96/noteapp:frontend-v1.2
docker push carlme96/noteapp:frontend-v1.2