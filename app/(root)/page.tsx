import BookList from '@/components/BookList';
import BookOverview from '@/components/BookOverview';
import { sampleBooks } from '@/constant';

const Home = () => {
  return (
    <>
      <BookOverview createdAt={null} {...sampleBooks[0]} />

      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
