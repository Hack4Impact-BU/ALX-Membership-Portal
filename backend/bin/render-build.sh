#!/usr/bin/env bash
# Exit on error
set -o errexit
# Enable tracing
set -x

bundle install
# bundle exec rails assets:precompile
# bundle exec rails assets:clean

# If you're using a Free instance type, you need to
# perform database migrations in the build command.
# Uncomment the following line:
bundle exec rails db:migrate

bundle exec rails db:seed