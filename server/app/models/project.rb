class Project < ApplicationRecord
  belongs_to :user
  has_many :discussions, dependent: :destroy
  has_many :attentions, dependent: :destroy

  validates :title, presence: true
  validates :info, presence: true
end
