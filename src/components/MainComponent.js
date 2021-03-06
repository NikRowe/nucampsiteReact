import React, { Component } from 'react';
// COMPONENTS
import Directory from './DirectoryComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import About from './AboutComponent';

//REACT ROUTER
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
// REDUX
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { postComment, fetchCampsites, fetchComments, fetchPromotions, fetchPartners, postFeedback } from '../redux/ActionCreators';
// ANIMATIONS
import { TransitionGroup, CSSTransition } from 'react-transition-group';



// REDUX functions to manage State
const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        partners: state.partners,
        promotions: state.promotions
    };
};

const mapDispatchToProps = {
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text)),
    fetchCampsites: () => (fetchCampsites()),
    resetFeedbackForm: () => (actions.reset('feedbackForm')),
    fetchComments: () => (fetchComments()),
    fetchPromotions: () => (fetchPromotions()),
    fetchPartners: () => (fetchPartners()),
    postFeedback: (firstName, lastName, phoneNum, email, agree, contactType, feedback) => (postFeedback(firstName, lastName, phoneNum, email, agree, contactType, feedback))
};

// MAIN holds switch & all other parent components
class Main extends Component {
    // Redux this assignments
    componentDidMount() {
        this.props.fetchCampsites();
        this.props.fetchComments();
        this.props.fetchPromotions();
        this.props.fetchPartners();
    }

    render() {
        // Initial view pulled from campsites data
        const HomePage = () => {
            return (
                <Home
                    campsite={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    campsitesLoading={this.props.campsites.isLoading}
                    campsitesErrMess={this.props.campsites.errMess}

                    partner={this.props.partners.partners.filter(partner => partner.featured)[0]}
                    partnersLoading={this.props.partners.isLoading}
                    partnersErrMess={this.props.partners.errMess}

                    promotion={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    promotionLoading={this.props.promotions.isLoading}
                    promotionErrMess={this.props.promotions.errMess}
                />
            );
        }

        // This is what displays when you click on a campsite from within Directory
        const CampsiteWithId = ({ match }) => {
            return (
                <CampsiteInfo
                    campsite={this.props.campsites.campsites.filter(campsite => campsite.id === +match.params.campsiteId)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}
                    comments={this.props.comments.comments.filter(comment => comment.campsiteId === +match.params.campsiteId)}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}
                />
            );
        };

        // The switch - React Router - this is how the links work for bringing up new pages/views
        return (
            <div>
                <Header />
                <TransitionGroup>
                    {/* className(S) below is how React Transitions knows what css properties to use */}
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch>
                            <Route path='/home' component={HomePage} />
                            <Route exact path='/directory' render={() => <Directory campsites={this.props.campsites} />} />
                            <Route path='/directory/:campsiteId' component={CampsiteWithId} />
                            <Route exact path='/contactus' render={() => <Contact postFeedback={this.props.postFeedback} resetFeedbackForm={this.props.resetFeedbackForm} />} />
                            <Route exact path='/aboutus' render={() => <About partners={this.props.partners} />} />
                            <Redirect to='/home' />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));