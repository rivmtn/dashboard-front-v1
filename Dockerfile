FROM node:20.12.0
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3000
CMD ["yarn", "dev"]
# RUN yarn build
# CMD ["yarn", "start"]

