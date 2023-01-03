class Project < ApplicationRecord
  belongs_to :user
  has_many :discussions, dependent: :destroy

  validates :title, presence: true
  validates :info, presence: true
end
