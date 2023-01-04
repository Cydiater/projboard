FROM ruby:3.1.3

WORKDIR /app

COPY . /app

RUN gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
RUN bundle config mirror.https://rubygems.org https://gems.ruby-china.com
RUN bundler install
RUN rails db:migrate RAILS_ENV=production
CMD rails server -e production
