import './Page.css';

export function MessagesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Messages</h1>
        <p>Direct communication with spas</p>
      </div>

      <div className="page-content">
        <div className="info-box">
          <h3>💬 Messaging System</h3>
          <p>
            This page will enable you to:
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>Send and receive messages from spa customers</li>
            <li>View conversation history organized by spa</li>
            <li>See unread message counts and notifications</li>
            <li>Respond to product inquiries and support requests</li>
            <li>Auto-moderation for compliance and professionalism</li>
          </ul>
          <p className="info-note">
            <strong>Sprint C.1-C.2:</strong> Messaging System (Weeks 9-10)<br />
            <strong>Database:</strong> Conversation & Message entities exist<br />
            <strong>GraphQL:</strong> vendorConversations, conversationMessages queries ready<br />
            <strong>Real-time:</strong> Will use GraphQL subscriptions
          </p>
        </div>
      </div>
    </div>
  );
}
