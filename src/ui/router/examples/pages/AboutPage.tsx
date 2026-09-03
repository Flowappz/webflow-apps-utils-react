import type { Router } from '../../router';
import './AboutPage.css';

interface Props {
  params: Record<string, string>;
  location: {
    pathname: string;
    search: string;
    params: Record<string, string>;
  };
  router: Router;
}

// Section content mapping
const sectionContent = {
  team: {
    title: 'Our Team',
    content: 'Meet the talented individuals who make our company great.',
    items: [
      {
        name: 'Alice Johnson',
        role: 'CEO & Founder',
        bio: 'Visionary leader with 15+ years experience.',
      },
      { name: 'Bob Smith', role: 'CTO', bio: 'Technical architect passionate about innovation.' },
      {
        name: 'Carol Davis',
        role: 'Lead Designer',
        bio: 'Creative mind behind our beautiful interfaces.',
      },
    ],
  },
  history: {
    title: 'Our History',
    content: 'Learn about our journey from startup to industry leader.',
    items: [
      {
        year: '2018',
        event: 'Company founded',
        description: 'Started with a small team and big dreams.',
      },
      {
        year: '2020',
        event: 'First major product launch',
        description: 'Released our flagship product to market.',
      },
      {
        year: '2023',
        event: 'International expansion',
        description: 'Opened offices in 5 new countries.',
      },
    ],
  },
  mission: {
    title: 'Our Mission',
    content: 'We strive to create technology that empowers people and transforms businesses.',
    items: [
      { value: 'Innovation', description: "Always pushing boundaries of what's possible." },
      { value: 'Quality', description: 'Delivering excellence in everything we do.' },
      { value: 'Integrity', description: 'Building trust through transparent practices.' },
    ],
  },
};

export function AboutPage({ params, location, router }: Props) {
  // Extract section from params
  const section = params.section || null;

  const currentSection =
    (section && sectionContent[section as keyof typeof sectionContent]) || null;

  return (
    <div className="about-page">
      {section && currentSection ? (
        <>
          <div className="section-header">
            <button className="back-button" onClick={() => router.navigate('/about')}>
              ← Back to About
            </button>
            <h1>{currentSection.title}</h1>
            <p className="section-description">{currentSection.content}</p>
          </div>

          <div className="section-content">
            {section === 'team' && currentSection && (
              <div className="team-grid">
                {currentSection.items.map((member, index) => (
                  <div className="team-card" key={index}>
                    <div className="avatar">
                      {'name' in member &&
                        member.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                    </div>
                    <h3>{'name' in member && member.name}</h3>
                    <p className="role">{'role' in member && member.role}</p>
                    <p className="bio">{'bio' in member && member.bio}</p>
                  </div>
                ))}
              </div>
            )}
            {section === 'history' && currentSection && (
              <div className="timeline">
                {currentSection.items.map((item, index) => (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-year">{'year' in item && item.year}</div>
                    <div className="timeline-content">
                      <h3>{'event' in item && item.event}</h3>
                      <p>{'description' in item && item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section === 'mission' && currentSection && (
              <div className="values-grid">
                {currentSection.items.map((value, index) => (
                  <div className="value-card" key={index}>
                    <h3>{'value' in value && value.value}</h3>
                    <p>{'description' in value && value.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section-navigation">
            <h3>Explore More</h3>
            <div className="nav-buttons">
              {Object.keys(sectionContent).map(
                (key) =>
                  key !== section && (
                    <button
                      className="nav-btn"
                      key={key}
                      onClick={() => router.navigate(`/about/${key}`)}
                    >
                      {sectionContent[key as keyof typeof sectionContent].title}
                    </button>
                  )
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="main-about">
          <header className="about-header">
            <h1>About Our Company</h1>
            <p className="lead">
              We're a technology company dedicated to building innovative solutions that make a
              difference in people's lives.
            </p>
          </header>

          <div className="about-sections">
            <h2>Learn More About Us</h2>
            <div className="sections-grid">
              <button className="section-card" onClick={() => router.navigate('/about/team')}>
                <div className="section-icon">👥</div>
                <h3>Our Team</h3>
                <p>Meet the passionate people behind our success.</p>
                <span className="section-link">Learn more →</span>
              </button>

              <button className="section-card" onClick={() => router.navigate('/about/history')}>
                <div className="section-icon">📈</div>
                <h3>Our History</h3>
                <p>Discover our journey from startup to industry leader.</p>
                <span className="section-link">Learn more →</span>
              </button>

              <button className="section-card" onClick={() => router.navigate('/about/mission')}>
                <div className="section-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>Understand the values and principles that guide us.</p>
                <span className="section-link">Learn more →</span>
              </button>
            </div>
          </div>

          <div className="stats-section">
            <h2>By the Numbers</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Team Members</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5</div>
                <div className="stat-label">Countries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="debug-section">
        <h3>Route Debug Information</h3>
        <div className="debug-info">
          <p>
            <strong>Current Path:</strong> {location?.pathname}
          </p>
          <p>
            <strong>Section Parameter:</strong> {section || 'None'}
          </p>
          <p>
            <strong>All Parameters:</strong> {JSON.stringify(params)}
          </p>
          <p>
            <strong>Search Query:</strong> {location?.search || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
}
