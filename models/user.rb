require "date"

require_relative "model"
require_relative "../lib/string_ext"
require_relative "../db/user_dao"

class User < Model
  attr_accessor :name, :mobile, :email, :email_confirmation

  def initialize(options = {})
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

    return false if name.nil? || name.blank?
    return false if mobile.nil?
    return false if email.nil?
    return false if email_confirmation.nil?
    return false if email != email_confirmation

    UserDAO.find_by_email(email).nil?
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

