Rails.application.routes.draw do
  # Resourceful routes
  resources :product_offers
  resources :get_involveds
  resources :eventlists
  resources :jobs, only: [:index, :create, :show, :destroy]
  resources :q_and_as, only: [:index, :show, :new, :create, :destroy]
  resources :research
  resources :training

  # Custom routes
  get "up" => "rails/health#show", as: :rails_health_check
  get '/profile', to: 'users#profile'
  post 'auth0/sign_up', to: 'auth0#sign_up'
  post 'auth0/login', to: 'auth0#login'
  post 'auth0/token', to: 'auth0#token'


  # Additional API endpoints (if you really need them in addition to the resourceful ones)
  get '/users', to: 'users#index'
  # The following line may be redundant with `resources :get_involveds`
  # get '/get_involved', to: 'get_involveds#index'
  
  # This custom route may be redundant with `resources :q_and_as`
  get '/q_and_a', to: 'q_and_as#index'

  # Uncomment and set your root route if needed
  # root "posts#index"
end