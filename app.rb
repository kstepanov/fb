require "cuba"
require "rack/protection"
require "rack/csrf"
require "cuba/render"
require "tilt/erb"
require 'spreadsheet'

Cuba.use Rack::Static, urls: %w(/stylesheets /images /javascripts), root: "public"
Cuba.use Rack::ShowExceptions
Cuba.use Rack::Session::Cookie, :secret => "hBw7h23GtHhe9vQH5zAvzACurjfb59mSpM6RJgjPNjhuY2ZeKSDfZDc6H2Duf7JQNdczFWtPnCkqsmFSbqhUwVe8Yzdu2MMnTwDA"
#Cuba.use Rack::Protection
#Cuba.use Rack::Protection::RemoteReferrer
Cuba.use Rack::Csrf, raise: true, :skip => ['POST:/']
Cuba.plugin Cuba::Render

require_relative "models/user"
require_relative "lib/string_ext"

Cuba.define do
  on get do
    on root do
      @user = User.new
      res.headers["X-Frame-Options"] = "GOFORIT"
      render("home")
    end

    on "thank-you" do
      render("thank-you")
    end

    on "admin" do
      
      book = Spreadsheet::Workbook.new
      sheet1 = book.create_worksheet :name => 'Users'

      sheet1.row(0).concat %w{Id Name Mobile Email Address Country City Interests}

      users = UserDAO.all
      users.each_with_index do |user, index|
        sheet1.row(index+1).push user[:id], user[:name], user[:mobile], user[:email], user[:address], user[:country], user[:city], user[:interests]
      end
      

      file_contents = StringIO.new
      book.write file_contents

      res.headers["Pragma"] = "public"
      res.headers["Expires"] = "0"
      res.headers["Cache-Control"] = "must-revalidate, post-check=0, pre-check=0"
      res.headers["Content-Type"] = "application/vnd.ms-excel"
      res.headers["Content-Disposition"] = "attachment; filename=\"Gap_Users.xls\";"
      res.headers["Content-Transfer-Encoding"] = "binary"
      res.write file_contents.read
    end

  end
  
  on post do
    on root do
      res.headers["X-Frame-Options"] = "GOFORIT"
      
      req["interests"] = req["interests"].join(",") unless req["interests"].nil?

      if ["name", "mobile", "email", "email_confirmation"].any?{ |field| !req[field].nil? }
        @user = User.new( name: req["name"], 
                          mobile: req["mobile"], 
                          email: req["email"], 
                          email_confirmation: req["email_confirmation"],
                          address: req["address"], 
                          country: req["country"], 
                          city: req["city"], 
                          interests: req["interests"]
                        )
        
        if @user.save
          render("thank-you")
        else
          render("home")
        end
      else
        @user = User.new
        render("home")
      end

    end
  end

end


#htpasswd -cbd htpasswd 
#gap SatrajitGAP