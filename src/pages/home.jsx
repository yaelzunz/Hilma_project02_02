import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Assets
import { AiFillStar, AiOutlineSearch } from 'react-icons/ai'
// Utils
import { removeDuplicates } from '../utils/objects.util'
// Styles
import styles from '../styles/pages/home.module.css'
// Components
import ArticleItem from '../components/article/ArticleItem'
// firebase
import { auth, db } from '../firebase/config'
import { deleteUser } from 'firebase/auth'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
// Configs
import { NEWS_DATA_API_KEY } from '../configs/apikeys.config'
import { NEWS_API_URL } from '../configs/url.config'

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ReactCardSlider from 'react-card-slider-component';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * Component renders the `404 not found` page.
 */
function Home() {
    // States

    const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)

    // Articles
    const [isLoading, setIsloading] = useState(true)
    const [myArticles, setMyArticles] = useState([])
    const [interestingArticles, setInterestingArticles] = useState([])

    // Handlers
    // const searchHandler = e => {
    //     // e.preventDefault()
    //     if (e.key === 'Enter') {
    //         navigate(`/search?q=${e.target.value}`)
    //     }
    // }
    const getData = async () => {
        if (loading) {
            console.log('Loading user data')
            return
        } else if (error) {
            // An error occurred while fetching user data
            window.location.href = '/login'
        } else {
            // User is authenticated
            console.log('User is authenticated:', user.email)

            // Get user details
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            if (!userDoc.exists()) {
                // User document does not exist
                console.log('User document does not exist')
                return
            }

            // Get random interest from array.
            const interests = userDoc.data().interests
            const random_interest = Math.round(Math.random() * interests.length)
            // Get suggested articles
            const interests_as_str = interests[random_interest]
            const res = await fetch(NEWS_API_URL.search(interests_as_str))
            const data = await res.json()

            const uniqueArticles = removeDuplicates(data.results ?? [], (a, b) => a.article_id === b.article_id)

            // Set interesting articles to results with no duplicates (by title)
            console.log('-- Interesting articles from news api')
            setInterestingArticles(uniqueArticles)

            // Get user articles
            const userArticles = userDoc.data().favoriteArticles ?? []
            const _myArticles = []
            for (const title of userArticles) {
                // Get article data by title (as id)
                const res = await fetch(NEWS_API_URL.by_title(title))
                const data = await res.json()
                if (data.results?.[0] && !_myArticles.some(a => a.title === data.results[0].title)) {
                    // Add article to myArticles & avoid duplicates
                    _myArticles.push(data.results?.[0])
                }
            }
            setMyArticles(_myArticles)
            // Set is-loading (for articles data) to false
            setIsloading(false)
        }
    }

    // Effects
    useEffect(() => {
        // Load data on initial page load.
        if (user) {
            getData()
        }
    }, [user])

    console.log({ myArticles, interestingArticles })


const sliderClick = () => {
return true
}

    const slides = [
        {image:"/imgs/questions.jpeg",title:"This is a title",description:"This is a description",clickEvent:sliderClick},
        {image:"/imgs/questions.jpeg",title:"This is a title",description:"This is a description",clickEvent:sliderClick},
        {image:"/imgs/questions.jpeg",title:"This is a title",description:"This is a description",clickEvent:sliderClick},
    ]
    return (
        <div className={styles['Home']}>

            <div className={styles['modal']}>
                <section className={styles['favorite-articles']}>
                    <div className={styles['heading']}>
                        <div className={styles['title']}>
                            {isLoading && <img src="imgs/loading.gif" alt="Loading articles" />}
                            <AiFillStar size={32} />
                            <h1>המאמרים המועדפים שלי</h1>
                        </div>
                        
                        {/* <div className={styles['search']}>
                            <AiOutlineSearch size={22} />
                            <input type="text" placeholder="חיפוש מאמר" onKeyDown={searchHandler} />
                        </div> */}
                    </div>
                    <div className={styles['articles-list']}>
                        {myArticles.map?.((a, i) => (
                            <ArticleItem key={i} {...a} />
                        ))}
                    </div>
                </section>
                <section className={styles['interesting-articles']}>
                    <div className={styles['heading']}>
                        <div className={styles['title']}>
                            {isLoading && <img src="imgs/loading.gif" alt="Loading articles" />}
                            {/* <h3>מאמרים שיכולים לעניין אותך</h3> */}
                            <div className={styles['sdd']}>
                            <ReactCardSlider slides={slides}/>
                                
                            </div>

                        </div>
                    </div>

                    <div className={styles['articles-list']}>
                        {interestingArticles.map?.((a, i) => (
                            <ArticleItem key={i} {...a} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Home




{/* <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        height="194"
        image="/imgs/questions.jpeg"
        alt="Paella dish"
      />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
        </CardContent>
      </Collapse>
    </Card> */}
    