import Map from '../components/Map';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Available Parking Spots</h1>
      <Map />
    </div>
  );
};

export default Home;