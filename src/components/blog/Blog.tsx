import React from 'react';
import { Grid, Container } from '@mui/material';
import Header from 'components/header/Header';
import MainFeaturedPost from 'components/posts/mainFeaturedPost/MainFeaturedPost';
import FeaturedPost from 'components/posts/featuredPost/FeaturedPost';
import Main from 'components/main/Main';
import raw from 'raw.macro';
import Sidebar from 'components/sidebar/Sidebar';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

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

const sidebar = {
  title: 'About',
  description: 'This is testing side bar design.',
  archives: [
    { title: 'December 2021', url: '#' },
    { title: 'January 2021', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};

const posts = [raw('../posts/testPost.md')];

function Blog() {
  return (
    <Container maxWidth='lg'>
      <Header title='Blog' sections={sections} />
      <main>
        <MainFeaturedPost post={mainFeaturedPost} />
        <Grid container spacing={4}>
          {featuredPosts.map((post) => (
            <FeaturedPost key={post.title} post={post} />
          ))}
        </Grid>
        <Grid container spacing={5} sx={{ mt: 3 }}>
          <Main title='Test Main Title' posts={posts} />

          <Sidebar
            title={sidebar.title}
            description={sidebar.description}
            archives={sidebar.archives}
            social={sidebar.social}
          />
        </Grid>
      </main>
    </Container>
  );
}

export default Blog;
