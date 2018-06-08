FROM risingstack/alpine:3.3-v6.2.0-3.6.0

COPY package.json package.json
ENV NODE_ENV=production
RUN npm install

# Add source files
COPY src/ src/
COPY index.js index.js
COPY server.js server.js

ENV PORT=80
EXPOSE 80

CMD ["npm","start"]
