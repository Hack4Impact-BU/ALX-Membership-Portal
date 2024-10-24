# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

jobs = [
  {
    title: "Software Engineer",
    company: "Tech Innovators",
    description: "Develop and maintain web applications using the latest technologies.",
    responsibilities: "Design, develop, and test software applications. Collaborate with cross-functional teams.",
    requirements: "Bachelor's degree in Computer Science. 3+ years of experience in full-stack development.",
    salary: "$110k/year",
    contact: "https://www.techinnovators.com/careers",
    logo: "https://example.com/logos/tech_innovators.png"
  },
  {
    title: "Data Analyst",
    company: "Insight Analytics",
    description: "Analyze large datasets to extract insights and support business decisions.",
    responsibilities: "Create reports, dashboards, and visualizations to communicate findings.",
    requirements: "Degree in Data Science or related field. Strong skills in Python and SQL.",
    salary: "$90k/year",
    contact: "https://www.insightanalytics.com/jobs",
    logo: "https://example.com/logos/insight_analytics.png"
  },
  {
    title: "Marketing Manager",
    company: "Creative Solutions",
    description: "Lead marketing campaigns and manage social media presence.",
    responsibilities: "Oversee marketing strategies and coordinate campaigns.",
    requirements: "5+ years of experience in marketing. Strong leadership and communication skills.",
    salary: "$85k/year",
    contact: "https://www.creativesolutions.com/careers",
    logo: "https://example.com/logos/creative_solutions.png"
  },
  {
    title: "Graphic Designer",
    company: "DesignWorks",
    description: "Create visually appealing designs for digital and print media.",
    responsibilities: "Design logos, websites, and promotional materials.",
    requirements: "Proficiency in Adobe Creative Suite. 2+ years of design experience.",
    salary: "$70k/year",
    contact: "https://www.designworks.com/jobs",
    logo: "https://example.com/logos/designworks.png"
  },
  {
    title: "Operations Manager",
    company: "Global Logistics",
    description: "Oversee daily operations and logistics for a global company.",
    responsibilities: "Manage supply chains and ensure timely delivery of goods.",
    requirements: "5+ years of operations management experience. Strong leadership skills.",
    salary: "$120k/year",
    contact: "https://www.globallogistics.com/jobs",
    logo: "https://example.com/logos/global_logistics.png"
  }
]

jobs.each do |job_data|
  Job.find_or_create_by(title: job_data[:title], company: job_data[:company]) do |job|
    job.description = job_data[:description]
    job.responsibilities = job_data[:responsibilities]
    job.requirements = job_data[:requirements]
    job.salary = job_data[:salary]
    job.contact = job_data[:contact]
    job.logo = job_data[:logo]
  end
end