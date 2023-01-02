Rails.application.routes.draw do
  scope '/api', defaults: { format: :json } do
    resources :users
    post 'login', to: 'authentication#login'
  end
end
