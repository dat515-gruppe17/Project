docker build . -t noteapp:proxy
docker tag noteapp:proxy carlme96/noteapp:proxy
docker push carlme96/noteapp:proxy