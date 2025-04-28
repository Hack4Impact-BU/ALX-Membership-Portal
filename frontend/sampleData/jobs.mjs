import axios from 'axios';

// Add the protocol (http://) to the URL
const apiBaseUrl = 'http://localhost:3001'; // or whatever port your backend runs on

const jobs = [
    {
        "title": "Healthcare Administrator",
        "company": "Wellness Medical Center",
        "location": "Denver, CO",
        "salary": "$85,000 - $105,000",
        "description": "Wellness Medical Center is looking for an experienced Healthcare Administrator to oversee daily operations of our multi-specialty clinic. You'll be responsible for managing staff, budgeting, and ensuring compliance with healthcare regulations.",
        "responsibilities": "Oversee daily operations and administrative functions. Develop and implement policies and procedures. Manage departmental budgets and financial reporting. Ensure compliance with healthcare laws and regulations. Supervise administrative and clinical staff members.",
        "requirements": "Bachelor's degree in Healthcare Administration or related field. 5+ years of experience in healthcare management. Knowledge of healthcare regulations and compliance requirements. Strong leadership and organizational skills. Experience with electronic health record systems.",
        "contact": "careers@wellnessmedical.org",
        "job_type": "Full-time"
    },
    {
        "title": "Software Engineer",
        "company": "Tech Solutions Inc.",
        "location": "San Francisco, CA",
        "salary": "$120,000 - $140,000",
        "description": "Tech Solutions Inc. is seeking a talented Software Engineer to join our dynamic development team. You'll be responsible for designing, coding, and testing software applications. You'll work closely with the development team to ensure high-quality code and efficient solutions.",
        "responsibilities": "Design, code, and test software applications. Collaborate with team members to develop and implement software solutions. Optimize code for performance and scalability. Troubleshoot and debug software issues. Maintain documentation and technical specifications.",
        "requirements": "Bachelor's degree in Computer Science or related field. 3+ years of experience in software development. Proficient in Java, Python, or JavaScript. Strong problem-solving and analytical skills. Excellent teamwork and communication skills.",
        "contact": "hr@techsolutionsinc.com",
        "job_type": "Full-time"
    },
    {
        "title": "Graphic Designer",
        "company": "Creative Design Studio",
        "location": "New York, NY",
        "salary": "$60,000 - $80,000",
        "description": "Creative Design Studio is looking for a talented Graphic Designer to create visually appealing and effective designs for print and digital media. You'll work closely with the marketing team to develop creative concepts and ensure high-quality design solutions.",
        "responsibilities": "Create designs for print and digital media. Collaborate with team members to develop creative concepts. Ensure designs are visually appealing and effective. Maintain documentation and design specifications. Participate in brainstorming sessions and provide creative input.",
        "requirements": "Bachelor's degree in Graphic Design or related field. 2+ years of experience in graphic design. Proficient in Adobe Creative Suite. Strong visual design skills and creative thinking. Excellent communication and teamwork skills.",
        "contact": "design@creativedesignstudio.com",
        "job_type": "Full-time"
    },
    {
        "title": "Sales Manager",
        "company": "Global Sales Solutions",
        "location": "Chicago, IL",
        "salary": "$90,000 - $110,000",
        "description": "Global Sales Solutions is seeking a dynamic Sales Manager to lead our sales team and drive revenue growth. You'll be responsible for developing sales strategies, managing client relationships, and achieving sales targets.",
        "responsibilities": "Develop and implement sales strategies. Manage a team of sales professionals. Maintain client relationships and ensure customer satisfaction. Analyze sales data and report on performance. Set and achieve sales targets. Provide training and support to the sales team.",
        "requirements": "Bachelor's degree in Business or related field. 5+ years of experience in sales management. Strong leadership and communication skills. Excellent negotiation and problem-solving abilities. Ability to manage a team and drive sales growth.",
        "contact": "sales@globalsales.com",
        "job_type": "Full-time"
    },
    {
        "title": "Marketing Coordinator",
        "company": "Green Echo Brands",
        "location": "Austin, TX",
        "salary": "$55,000 - $70,000",
        "description": "Green Echo Brands is looking for a creative Marketing Coordinator to support our sustainable product lines. You'll help develop and implement marketing strategies to increase brand awareness and drive sales for our eco-friendly products.",
        "responsibilities": "Assist in planning and executing marketing campaigns. Manage social media accounts and create engaging content. Track and analyze marketing metrics. Coordinate with graphic designers for visual assets. Organize promotional events and product launches.",
        "requirements": "Bachelor's degree in Marketing, Communications, or related field. 1-2 years of marketing experience. Proficiency in social media platforms and marketing tools. Strong written and verbal communication skills. Experience with Adobe Creative Suite is a plus.",
        "contact": "hr@greenechobrand.com",
        "job_type": "Full-time"
    },
    {
        "title": "Project Manager",
        "company": "Project Management Pros",
        "location": "Seattle, WA",
        "salary": "$70,000 - $90,000",
        "description": "Project Management Pros is seeking a skilled Project Manager to oversee projects from start to finish. You'll be responsible for planning, organizing, and managing resources to achieve project goals. You'll work closely with team members to ensure successful project completion.",
        "responsibilities": "Plan, organize, and manage project resources. Develop project timelines and budgets. Monitor progress and ensure project goals are met. Manage team members and resources. Prepare reports and documentation. Identify and mitigate risks. Ensure project success.",
        "requirements": "Bachelor's degree in Project Management or related field. 3+ years of experience in project management. Proficient in project management tools and methodologies. Strong leadership and communication skills. Ability to manage multiple projects and teams.",
        "contact": "pm@projectmanagementpros.com",
        "job_type": "Full-time"
    },
    {
        "title": "Content Writer",
        "company": "Content Creators",
        "location": "Austin, TX",
        "salary": "$50,000 - $70,000",
        "description": "Content Creators is looking for a talented Content Writer to create engaging and informative content for our website and social media platforms. You'll work closely with the marketing team to develop creative content and ensure high-quality writing.",
        "responsibilities": "Create engaging and informative content for our website and social media platforms. Collaborate with team members to develop creative content. Ensure content is well-written and meets SEO standards. Maintain documentation and content specifications. Participate in brainstorming sessions and provide creative input.",
        "requirements": "Bachelor's degree in Journalism, Communications, or related field. 2+ years of experience in content writing. Proficient in SEO and social media platforms. Strong writing and communication skills. Excellent teamwork and creative thinking.",
        "contact": "content@contentcreators.com",
        "job_type": "Full-time"
    },
    {
        "title": "Data Scientist",
        "company": "AnalyticsAI",
        "location": "Remote",
        "salary": "$130,000 - $160,000",
        "description": "AnalyticsAI is seeking an experienced Data Scientist to help us harness the power of data to drive business decisions. You'll work with large datasets to develop models that provide actionable insights for our clients across various industries.",
        "responsibilities": "Develop and implement advanced machine learning algorithms. Clean and preprocess large datasets for analysis. Create data visualizations to communicate findings. Work with engineering team to deploy models to production. Stay current with latest research and techniques in data science.",
        "requirements": "Master's or PhD in Computer Science, Statistics, or related field. 5+ years of experience in data science or machine learning roles. Proficiency in Python, R, and SQL. Experience with TensorFlow, PyTorch, or similar frameworks. Strong background in statistical analysis and mathematics.",
        "contact": "talent@analyticsai.tech",
        "job_type": "Full-time"
    },
    {
        "title": "Elementary School Teacher",
        "company": "Bright Horizons Academy",
        "location": "Chicago, IL",
        "salary": "$48,000 - $62,000",
        "description": "Bright Horizons Academy is seeking a passionate Elementary School Teacher for grades 3-5. You'll create an engaging learning environment that fosters academic, social, and emotional development for a diverse group of students.",
        "responsibilities": "Develop and implement lesson plans aligned with curriculum standards. Assess student performance and provide feedback. Communicate with parents about student progress. Create a positive classroom environment. Collaborate with other teachers and staff members.",
        "requirements": "Bachelor's degree in Education or related field. Valid teaching certification for elementary education. Experience teaching elementary school students. Strong classroom management skills. Ability to adapt teaching methods to meet diverse student needs.",
        "contact": "hr@brighthorizonsacademy.edu",
        "job_type": "Full-time"
    }
];

async function postSampleJobs() {
  for (const job of jobs) {
    try {
      // Create the properly structured data for Rails
      const formData = new FormData();
      formData.append('job[title]', job.title);
      formData.append('job[company]', job.company);
      formData.append('job[description]', job.description);
      formData.append('job[responsibilities]', job.responsibilities);
      formData.append('job[requirements]', job.requirements);
      formData.append('job[salary]', job.salary);
      formData.append('job[contact]', job.contact);
      formData.append('job[location]', job.location);
      formData.append('job[job_type]', job.job_type);
      console.log(formData);
      const response = await axios.post(`${apiBaseUrl}/jobs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(`Job '${job.title}' posted successfully`, response.data);
    } catch (error) {
      console.error(`Error posting job '${job.title}':`, error.message);
      
      if (error.response && error.response.data && error.response.data.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
    }
  }
}

// Call the function
postSampleJobs();