require "date"

require_relative "model"
require_relative "../lib/string_ext"
require_relative "../db/user_dao"

class User < Model
  attr_accessor :name, :mobile, :email, :email_confirmation, :errors
  
  def initialize(options = {})
    @errors = { name:{ :message => "" },
                mobile:{ :message => "" },
                email:{ :message => "", :class => "" },
                email_confirmation:{ :message => "" } }

    options.each do |k, v|
      instance_variable_set "@#{k}".to_sym, v
    end
  end
  
  def created_at=(date)
    @created_at = case date
                  when Date then date
                  when Numeric then Time.at(date).utc
                  end
  end
  
  def created_at
    @created || Time.now.utc
  end
  
  def valid?

    if name.nil? || name.blank?
      errors[:name][:message] = "Name can not be blank."
    end
    
    if mobile.nil?
      errors[:mobile][:message] = "Mobile can not be blank."
    end

    if email.nil?
      errors[:email][:message] = "Email can not be blank."
    end

    if email_confirmation.nil?
      errors[:email_confirmation][:message] = "Email confirmation can not be blank."
    end

    if email != email_confirmation
      errors[:email][:message] = "Emails must be equal."
      errors[:email_confirmation][:message] = @errors[:email][:message]
    end

    if !UserDAO.find_by_email(email).nil?
      errors[:email][:message] = "The email address entered already exists in our system. Please enter a different email address."
      errors[:email][:class] = "error"
    end

    !@errors.each_value.any?{ |val| !val[:message].empty? }
  end
  
  def save
    ::UserDAO.save(self) if valid?
  end
  
  #class << self
    #def due_on(due_date)
    #  ::TaskDAO.find_all_by_due_on(due_date).map do |attrs|
    #    new attrs
    #  end
    #end
    
    #def delete_all
    #  ::UserDAO.delete_all
    #end
  #end
end

