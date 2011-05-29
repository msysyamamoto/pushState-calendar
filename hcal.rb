# -*- coding: utf-8 -*-
require 'rubygems'
require 'date'
require 'sinatra'
require 'slim'

configure :development do
  Slim::Engine.set_default_options :pretty => true
end

get '/' do
  today = Date.today
  year  = today.year.to_s
  month = '%02d' % today.month
  host  = @env['HTTP_HOST']
  redirect "http://#{host}/#{year}/#{month}"
end

get %r{\A/(\d{4})/(\d{2})\z} do |year, month|
  begin
    @this_month = Date.new(year.to_i, month.to_i, 1)
  rescue
    halt 404
  end

  @next_month = @this_month >> 1
  @prev_month = @this_month << 1
  @next_year  = @this_month >> 12 
  @prev_year  = @this_month << 12 

  first_day = @this_month - @this_month.wday
  last_day  = Date.new(@next_month.year, @next_month.month, 1) - 1
  last_day  = last_day + (6 - last_day.wday)

  days = []
  first_day.upto(last_day) {|d| days << d}
  @weeks = days.each_slice(7)
  slim :index
end

get '/hcal.css' do
  sass :hcal
end

helpers do
  def date_href(date)
    year  = '%04d' % date.year
    month = '%02d' % date.month
    "/#{year}/#{month}"
  end

  def dcell_class(date)
    classes = ['dcell']

    if date.wday == 0
      classes << 'sun'
      classes << 'bottomleft' if @weeks.to_a.last.include? date
    elsif date.wday == 6
      classes << 'sat'
      classes << 'bottomright' if @weeks.to_a.last.include? date
    end
    
    if date.month != @this_month.month
      classes << 'not_this_month'
    end

    classes.join(' ')
  end
end
