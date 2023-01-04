FROM ruby:3.1.3

WORKDIR /app

COPY . /app

RUN bundler install
RUN rails db:migrate RAILS_ENV=production
CMD rails server -e production
