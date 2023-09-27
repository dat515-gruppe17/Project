docker build . -t noteapp:backend
docker tag noteapp:backend carlme96/noteapp:backend
docker push carlme96/noteapp:backend