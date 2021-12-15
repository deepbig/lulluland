import React from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery, Grid, Container } from '@mui/material';
import Header from 'components/header/Header';
import MainFeaturedPost from 'components/posts/mainFeaturedPost/MainFeaturedPost';
import FeaturedPost from 'components/posts/featuredPost/FeaturedPost';
import testPost from 'components/posts/testPost.md';

const sections = [{ title: 'test', url: 'blog' }];

const mainFeaturedPost = {
  title: 'Test title',
  description: 'this is testing description.',
  image: '',
  imageText: 'testing title image',
  linkText: 'Continue reading..',
};

const featuredPosts = [
  {
    title: 'Feature Post test',
    date: 'Nov 12 2021',
    description: 'This is testing feature post describtion',
    image: '',
    imageLabel: 'Image Text',
  },
];

// const posts = [testPost];

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
        </main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
