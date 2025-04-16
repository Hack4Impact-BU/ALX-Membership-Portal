Rails.application.routes.draw do
  # Resourceful routes with editing capabilities
  resources :product_offers
  resources :get_involveds
  resources :eventlists
  resources :jobs
  resources :q_and_as, only: [:index, :show, :new, :create, :update, :destroy]
  resources :research
  resources :training

  # Custom routes
  get "up" => "rails/health#show", as: :rails_health_check
  get '/profile', to: 'users#profile'
  post 'auth0/sign_up', to: 'auth0#sign_up'
  post 'auth0/login', to: 'auth0#login'
  post 'auth0/token', to: 'auth0#token'


  # Additional API endpoints
  get '/users', to: 'users#index'
  # The following line may be redundant with `resources :get_involveds`
  # get '/get_involved', to: 'get_involveds#index'
  
  # This custom route may be redundant with `resources :q_and_as`
  get '/q_and_a', to: 'q_and_as#index'

  # Job routes with nested save functionality
  resources :jobs do
    # /jobs/:job_id/save
    post 'save', to: 'saved_jobs#create'
    delete 'save', to: 'saved_jobs#destroy'
  end
  
  # Get all saved jobs for the current user
  get 'saved_jobs', to: 'saved_jobs#index'

  # Uncomment and set your root route if needed
  # root "posts#index"
end