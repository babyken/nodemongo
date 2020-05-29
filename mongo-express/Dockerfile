FROM mongo-express
WORKDIR /node_modules/mongo-express
COPY wait-for-it.sh /
RUN chmod +x /wait-for-it.sh
# RUN apk add --no-cache bash