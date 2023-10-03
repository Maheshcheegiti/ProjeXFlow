import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract values from state
    const formData = {
      name,
      email,
      message,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid Email Format");
      return;
    }

    if (formData.name.length < 6) {
      toast.error("Name must be atleast 6 characters");
      return;
    }

    if (formData.message.length < 10) {
      toast.error("Your message is not concised");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/sendmesg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        toast.success("Message sent successfully!");
        // Clear the form after successful submission
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Error sending message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Server error. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <Fragment>
      <div className="contact-container about-us-container">
        <div className="contact-left">
          <h2>About Me</h2>
          <p>
            Hello! I'm Cheegiti Mahesh, a passionate full-stack developer with a
            strong love for creating innovative web applications. With years of
            experience in both front-end and back-end development, I'm dedicated
            to crafting robust and user-friendly solutions for a variety of
            projects.
          </p>
          <p>
            My journey in web development started with a curiosity to build
            things that make an impact. I thrive on staying updated with the
            latest technologies and best practices to deliver top-notch
            experiences to users. My goal is to make the web a better place by
            leveraging cutting-edge tools and turning ideas into reality.
          </p>
          <p>
            Whether it's designing elegant user interfaces or optimizing
            database performance, I enjoy the challenges that come with being a
            full-stack developer. I believe that every project is an opportunity
            to learn and innovate, and I'm excited to take on new challenges.
          </p>

          <h2>Contact Me</h2>
          <p>
            Feel free to reach out to me using the following contact
            information:
          </p>
          <div className="contact-info">
            <p>
              <i className="fas fa-envelope"></i>{" "}
              <a href="mailto:ramahesh024@gmail.com">ramahesh024@gmail.com</a>
            </p>
            <p>
              <i className="fas fa-phone"></i> +91 8639838411
            </p>
          </div>

          <h2>Connect on Social Media</h2>
          <p>
            Let's stay connected on social media. You can find me on the
            following platforms:
          </p>
          <div className="social-media-icons">
            <a
              href="https://twitter.com/maheshaaryan24"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="fa-brands fa-x-twitter"></i> Twitter
            </a>
            <a
              href="https://www.instagram.com/mahesh_aaryan_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/cheegitimahesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>
        <div className="contact-form-div">
          <h2>Contact Form</h2>
          <p>
            If you have any questions, suggestions, or would like to discuss a
            project, please feel free to use the contact form below:
          </p>
          <form className="contact-form form-section" onSubmit={handleSubmit}>
            <div className="inputs">
              <div className="form-group">
                <label htmlFor="name">
                  <i class="fa-regular fa-user"></i>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  <i class="fa-regular fa-envelope"></i>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={email} // Add value prop
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">
                  <i class="fa-regular fa-message nrml-label"></i>
                </label>
                <span className="msg-here">
                  Message here..{" "}
                  <i class="fa-regular fa-hand-point-up fa-fade"></i>
                </span>
                <div className="clear"></div>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Enter your message here..."
                  value={message} // Add value prop
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              {isLoading && <span className="circle-span"></span>}
              <button className="btn" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Contact;
