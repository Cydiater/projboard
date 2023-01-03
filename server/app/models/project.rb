class Project < ApplicationRecord
  belongs_to :user
  has_many :discussions

  validates :title, presence: true
  validates :info, presence: true
end
