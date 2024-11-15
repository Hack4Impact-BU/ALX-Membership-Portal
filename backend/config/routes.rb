Rails.application.routes.draw do
  resources :get_involveds
  resources :benefits_discounts
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  get '/profile', to: 'users#profile'
  post 'auth0/sign_up', to: 'auth0#sign_up'
  post 'auth0/login', to: 'auth0#login'
  
  # Defines the root path route ("/")
  # root "posts#index"

    # Other routes
  
   
    # API endpoint to get test_table data
  get '/users', to: 'users#index'
  get '/get_involved', to: 'get_involveds#index'

  get '/benefits_discount', to: 'benefits_discounts#index'

  Rails.application.routes.draw do
  resources :get_involveds
    resources :jobs, only: [:index, :create, :show]
  end

end