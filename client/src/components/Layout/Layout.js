import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from 'react-helmet'
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, title, description, keywords, author }) => {
    return (
        <div>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='description' content={description} />
                <meta name='keywords' content={keywords} />
                <meta name='author' content={author} />
                <title>{title}</title>
            </Helmet>
            <Header />
            <main style={{
                minHeight: '73.4vh'
            }}>
                <Toaster />
                {children}
            </main>
            <Footer />
        </div>
    )
};

Layout.defaultProps = {
    title: 'E-Commerce App - Shop Now',
    description: 'A simple e-commerce website built with React',
    keywords: 'e-commerce, react, javascript, mern, mongodb',
    author: 'Nipun Bakshi'
};

export default Layout