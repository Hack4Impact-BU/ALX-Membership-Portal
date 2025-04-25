$stdout.sync = true
puts "--- STARTING SEED FILE ---"
# db/seeds.rb

# --- Ensure Faker is available ---
# Add `gem 'faker'` to your Gemfile and run `bundle install`
begin
  require 'faker'
rescue LoadError
  puts "*" * 80
  puts "Please add `gem 'faker'` to your Gemfile and run `bundle install` to generate fake data."
  puts "*" * 80
  # Define dummy Faker methods if the gem is missing, to avoid crashing the seed
  module Faker
    module Lorem; def self.sentence(word_count:); "Fake sentence."; end; def self.paragraph(sentence_count:); "Fake paragraph."; end; def self.paragraphs(number:); ["Fake paragraphs."]; end; end
    module Name; def self.name; "Fake Name"; end; end
    module Internet; def self.email; "fake-#{rand(10000)}@example.com"; end; end
    module Company; def self.name; "Fake Company"; end; def self.bs; "fake business stuff"; end; end
    module Address; def self.full_address; "Fake Address"; end; end
    module PhoneNumber; def self.phone_number; "555-123-4567"; end; end
    module Date; def self.between(from:, to:); ::Date.today; end; end
    module Time; def self.between(from:, to:); ::Time.now; end; end
    module Commerce; def self.price(range:); rand(range).to_f; end; end
    module Business; def self.business_type; "Fake Type"; end; end
  end
end

# puts "--- MINIMAL SEED TEST ---"

puts "Seeding database..."

# --- Clear Existing Data (Optional - Use with caution, mainly for development) ---
puts "Destroying existing SavedJobs..."
SavedJob.destroy_all
puts "Destroying existing ProductOffers..."
ProductOffer.destroy_all
puts "Destroying existing Eventlists..."
Eventlist.destroy_all
puts "Destroying existing GetInvolveds..."
GetInvolved.destroy_all
puts "Destroying existing Researches..."
Research.destroy_all
puts "Destroying existing Trainings..."
Training.destroy_all
puts "Destroying existing Jobs..."
Job.destroy_all
puts "Destroying existing Users..."
User.destroy_all
puts "Destroying existing QandAs..."
QAndA.destroy_all
# ... destroy other models if needed ...
puts "Finished destroying data."
# Note: Using find_or_create_by below is generally safer and idempotent.

# --- Seed Users ---
puts "Creating Users..."
5.times do |i|
  User.find_or_create_by!(email: "seed_user_#{i+1}@example.com") do |u|
    u.name = Faker::Name.name
  end
end
puts "#{User.count} users in DB."
# Store users for associations
users = User.all

# --- Seed Jobs ---
puts "Creating Jobs..."
# Specific jobs
job1 = Job.find_or_create_by!(title: 'Software Engineer') do |j|
  j.company = Faker::Company.name
  j.description = Faker::Lorem.paragraph(sentence_count: 3)
  j.responsibilities = Faker::Lorem.paragraph(sentence_count: 4)
  j.requirements = Faker::Lorem.paragraph(sentence_count: 3)
  j.salary = "$#{Faker::Commerce.price(range: 80000..150000).round(2)} / year"
  j.contact = Faker::Internet.email # Use standard email
  j.location = Faker::Address.full_address
  j.job_type = ['Full-time', 'Part-time', 'Contract'].sample
  j.is_saved = false
end

job2 = Job.find_or_create_by!(title: 'Product Manager') do |j|
  j.company = Faker::Company.name
  j.description = Faker::Lorem.paragraph(sentence_count: 3)
  j.responsibilities = Faker::Lorem.paragraph(sentence_count: 4)
  j.requirements = Faker::Lorem.paragraph(sentence_count: 3)
  j.salary = "$#{Faker::Commerce.price(range: 90000..180000).round(2)} / year"
  j.contact = Faker::Internet.email # Use standard email
  j.location = Faker::Address.full_address
  j.job_type = ['Full-time', 'Remote'].sample
  j.is_saved = false
end

# Create more generic jobs
15.times do |i|
    Job.find_or_create_by!(title: "Sample Job #{i+1}") do |j|
      j.company = Faker::Company.name
      j.description = Faker::Lorem.paragraph(sentence_count: 2 + rand(3)) # Vary length
      j.responsibilities = Faker::Lorem.paragraph(sentence_count: 3 + rand(4))
      j.requirements = Faker::Lorem.paragraph(sentence_count: 2 + rand(2))
      j.salary = ["Competitive", "$#{Faker::Commerce.price(range: 50000..120000).round(2)} / year", "Hourly: $#{Faker::Commerce.price(range: 25..75).round(2)}"].sample
      j.contact = Faker::Internet.email # Use standard email
      j.location = Faker::Address.full_address
      j.job_type = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'].sample
      j.is_saved = false
    end
end
puts "#{Job.count} jobs in DB."
# Store jobs for associations
jobs = Job.all

# --- Seed SavedJobs ---
puts "Creating SavedJobs..."
# Ensure users and jobs exist before creating saved jobs
if users.any? && jobs.any?
  # Using first 5 users and sample jobs for predictability if needed
  users.first(5).each do |user|
    jobs.sample(3).each do |job|
      # Use user's email as user_id, matching SavedJobsController logic
      SavedJob.find_or_create_by!(user_id: user.email, job: job)
    end
  end
else
  puts "Skipping SavedJobs creation as no users or jobs found."
end
puts "#{SavedJob.count} saved jobs in DB."

# --- Seed Q&As ---
puts "Creating Q&As..."
QAndA.find_or_create_by!(question: "What is the main goal?") do |qa|
  qa.answer = "To provide useful information and resources for our members."
end
QAndA.find_or_create_by!(question: "How can I get involved?") do |qa|
  qa.answer = "Check the 'Get Involved' section for current opportunities or contact the administration."
end
QAndA.find_or_create_by!(question: "What are the membership benefits?") do |qa|
  qa.answer = "Members receive access to exclusive events, job boards, product discounts, and research materials."
end
QAndA.find_or_create_by!(question: "How do I reset my password?") do |qa|
  qa.answer = "Currently, password reset functionality is handled by contacting support."
end
QAndA.find_or_create_by!(question: "Where can I find the event schedule?") do |qa|
  qa.answer = "The full event schedule is available under the 'Events' tab after logging in."
end
puts "#{QAndA.count} Q&As in DB."

# --- Seed Eventlists --- 
puts "Creating Eventlists..."
15.times do |i|
  Eventlist.create!(
    eventType: ['Workshop', 'Seminar', 'Conference', 'Meetup', 'Webinar', 'Social Gathering'].sample,
    startDate: Faker::Date.between(from: 1.week.from_now, to: 4.months.from_now),
    endDate: Faker::Date.between(from: 4.months.from_now, to: 6.months.from_now),
    location: [Faker::Address.full_address, 'Online'].sample,
    org: Faker::Company.name,
    timeStart: Faker::Time.between(from: DateTime.now.beginning_of_day + 8.hours, to: DateTime.now.beginning_of_day + 16.hours).strftime("%H:%M"),
    timeEnd: Faker::Time.between(from: DateTime.now.beginning_of_day + 10.hours, to: DateTime.now.beginning_of_day + 18.hours).strftime("%H:%M"),
    eventName: "#{Faker::Company.catch_phrase} #{['Workshop', 'Summit', 'Meetup', 'Talk'].sample} ##{i+1}",
    eventDesc: Faker::Lorem.paragraph(sentence_count: 5 + rand(5)),
    instruct: Faker::Lorem.sentence,
    phone: Faker::PhoneNumber.phone_number
  )
end
puts "#{Eventlist.count} events in DB."
# Store eventlists for associations
eventlists = Eventlist.all 

# --- Seed SavedEvents ---
puts "Creating SavedEvents..."
if users.any? && eventlists.any?
  users.first(5).each do |user|
    eventlists.sample(4).each do |event|
      # Use user's email as user_id
      SavedEvent.find_or_create_by!(user_id: user.email, eventlist: event)
    end
  end
else
  puts "Skipping SavedEvents creation as no users or eventlists found."
end
puts "#{SavedEvent.count} saved events in DB."

# --- Seed Other Models ---

puts "Creating GetInvolveds..."
10.times do
  GetInvolved.create!(
    title: "Volunteer for: " + Faker::Company.bs.capitalize,
    summary: Faker::Lorem.paragraph(sentence_count: 2),
    description: Faker::Lorem.paragraphs(number: 2).join("\n\n"), # Longer description
    date: Faker::Date.between(from: 1.week.from_now, to: 3.months.from_now),
    time: Faker::Time.between(from: DateTime.now.beginning_of_day + 9.hours, to: DateTime.now.beginning_of_day + 17.hours).strftime("%I:%M %p"),
    location: [Faker::Address.full_address, 'Remote Assistance Needed'].sample,
    phone: Faker::PhoneNumber.phone_number
  )
end
puts "#{GetInvolved.count} 'get involved' items in DB."

puts "Creating ProductOffers..."
20.times do
  ProductOffer.create!(
    place: Faker::Company.name,
    offerTitle: "#{rand(5..50)}% off #{Faker::Commerce.product_name}",
    offerDesc: Faker::Lorem.paragraph(sentence_count: 3 + rand(3)),
    instruct: "Mention this offer or show your membership card.",
    isSaved: [true, false].sample, # Randomly save some
    startDate: Faker::Date.between(from: 1.month.ago, to: 1.month.from_now),
    endDate: Faker::Date.between(from: 1.month.from_now, to: 6.months.from_now),
    businessType: Faker::Company.industry,
    pic_url: nil # Add image URLs if desired, e.g., Faker::LoremFlickr.image
  )
end
puts "#{ProductOffer.count} product offers in DB."


puts "Creating Researches..."
12.times do
  Research.create!(
    researchTitle: "Study on the Impact of #{Faker::Company.industry} on #{Faker::Company.bs.capitalize}",
    researchDesc: Faker::Lorem.paragraphs(number: 3).join("\n\n"),
    link: Faker::Internet.url,
    date: Faker::Date.between(from: 2.years.ago, to: Date.today),
    location: ['Online Publication', 'University Archive', 'Internal Report'].sample
  )
end
puts "#{Research.count} research items in DB."


puts "Creating Trainings..."
18.times do
  Training.create!(
    trainingTitle: "#{Faker::Company.profession.capitalize} Training: Level #{rand(1..3)}",
    trainingDesc: Faker::Lorem.paragraph(sentence_count: 4 + rand(4)),
    link: Faker::Internet.url,
    date: Faker::Date.between(from: Date.today, to: 8.months.from_now)
  )
end
puts "#{Training.count} training items in DB."


puts "Seeding finished!"