# This script continuously pings the frontend and backend to determine if the app is up and running.
# Author: Andy Zawada (atzawada@gmail.com)

CHECKS=0

FRONTEND_CONNECTION=$(curl -i -m 5 http://localhost:3000 | grep "200 OK")
BACKEND_CONNECTION=$(curl -i -m 5 http://localhost:4000/ping | grep "200 OK")

while [ $CHECKS -lt 40 ] && [ -z "$FRONTEND_CONNECTION" ] || [ -z "$BACKEND_CONNECTION" ]
do
    sleep 10
    
    FRONTEND_CONNECTION=$(curl -i -k -m 5 http://localhost:3000 | grep "200 OK")
    BACKEND_CONNECTION=$(curl -i -m 5 http://localhost:4000/ping | grep "200 OK")

    CHECKS=$((CHECKS+1))
    echo "No. of checks is $CHECKS"
done

if [ -z "$FRONTEND_CONNECTION" ]
then
    echo "Frontend failed to start successfully"
    exit -1
elif [ -z "$BACKEND_CONNECTION" ]
then
    echo "Backend failed to start successfully"
    exit -1
else
    echo "App is up and running."
fi