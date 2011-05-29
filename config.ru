require 'rubygems'
require 'bundler'

Bundler.require

require './hcal'

run Sinatra::Application
