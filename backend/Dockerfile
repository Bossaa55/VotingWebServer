
FROM python:3.9


WORKDIR /code


COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./app /code/app

CMD echo "Starting FastAPI with ${WORKERS_AMOUNT:-12} workers." && gunicorn -k uvicorn.workers.UvicornWorker app.main:app --workers ${WORKERS_AMOUNT:-12} --bind 0.0.0.0:80