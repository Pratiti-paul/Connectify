import { useState } from "react";

function WelcomeScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();

    // Validations
    if (!cleanUsername) {
      setError("Username cannot be empty");
      return;
    }

    if (cleanUsername.length < 2 || cleanUsername.length > 15) {
      setError("Username must be between 2 and 15 characters");
      return;
    }

    // Alphanumeric only validation
    const alphanumericRegex = /^[a-zA-Z0-9_]+$/;
    if (!alphanumericRegex.test(cleanUsername)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setError("");
    onJoin(cleanUsername);
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
    if (error) setError(""); // Clear error when user types
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-logo">
          <span className="logo-bubble">💬</span>
          <h1>Connectify</h1>
          <p className="welcome-subtitle">A modern real-time messaging space</p>
        </div>

        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="input-group">
            <label htmlFor="username-input" className="input-label">
              Choose your username
            </label>
            <input
              id="username-input"
              type="text"
              placeholder="e.g. Alice_123"
              value={username}
              onChange={handleInputChange}
              maxLength={15}
              autoFocus
              autoComplete="off"
              className={error ? "input-field error-state" : "input-field"}
            />
            {error && <span className="error-message" role="alert">{error}</span>}
          </div>

          <button type="submit" className="join-btn">
            Enter Chat Space
          </button>
        </form>
      </div>

      <style>{`
        .welcome-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 460px;
          animation: fadeIn 0.4s ease-out;
        }

        .welcome-card {
          width: 100%;
          background-color: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: var(--border-radius-lg);
          padding: 40px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: var(--shadow-lg);
          text-align: center;
        }

        .welcome-logo {
          margin-bottom: 32px;
        }

        .logo-bubble {
          font-size: 3rem;
          display: inline-block;
          margin-bottom: 12px;
          animation: pulse 2s infinite ease-in-out;
        }

        .welcome-card h1 {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, var(--text-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .welcome-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 400;
        }

        .welcome-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          text-align: left;
          width: 100%;
        }

        .input-label {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          background-color: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-smooth);
        }

        .input-field:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px var(--accent-glow);
          background-color: rgba(15, 23, 42, 0.8);
        }

        .input-field.error-state {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
        }

        .error-message {
          color: #f87171;
          font-size: 0.8rem;
          font-weight: 400;
          margin-top: 2px;
        }

        .join-btn {
          width: 100%;
          padding: 14px;
          background: var(--bubble-sent);
          border: none;
          border-radius: var(--border-radius-md);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-neon);
        }

        .join-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .join-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .welcome-card {
            padding: 32px 24px;
            border-radius: 0;
            border: none;
            background: transparent;
            backdrop-filter: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}

export default WelcomeScreen;
