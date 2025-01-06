const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            Welcome! I'm passionate about solving urban parking challenges through technology.
            This platform aims to make parking easier and more efficient for everyone.
          </p>
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            To create a community-driven parking solution that helps drivers find spots quickly
            while enabling spot owners to earn from their unused spaces.
          </p>
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>
          <ul className="list-disc pl-5 text-gray-700 mb-4">
            <li>Find available parking spots on our interactive map</li>
            <li>Purchase tokens to reserve spots</li>
            <li>List your own parking spots to earn tokens</li>
            <li>Join our community of smart parkers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;