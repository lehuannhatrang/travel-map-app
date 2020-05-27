import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import i18n from "i18n-js";
import { Images, argonTheme } from "../constants";
import Icon from './Icon';

const MAXIMUM_CHARACTER_SHOW = 100
class Comment extends React.Component {
    constructor(props) {
        super(props);
    }
    convertTimestampToCurrentTime(time) {
        const timeStamp = new Date(time)
        let now = new Date(),
            secondsPast = (now.getTime() - timeStamp) / 1000;
        if (secondsPast < 60) {
            return 'Just now';
        }
        if (secondsPast < 3600) {
            return parseInt(secondsPast / 60) + 'm ago';
        }
        if (secondsPast <= 86400) {
            return parseInt(secondsPast / 3600) + 'h ago';
        }
        if (secondsPast > 86400) {
            day = timeStamp.getDate();
            month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
            year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
            return day + " " + month + year;
        }
    }

    render() {
        const { comment, showAll } = this.props;
        return (
            <Block style={{marginBottom: 20}}>
                <Block row>
                <Image
                    source={comment.author.avatar? { uri: `data:image/gif;base64,${comment.author.avatar}`} : Images.ProfilePicture}
                    resizeMode="cover"
                    style={styles.commentAvatar}
                    />
                    <Text bold color="#525F7F" style={{paddingTop: 6, marginLeft: 5}}>{comment.author.displayName}</Text>
                    <Text color={theme.COLORS.MUTED} style={{paddingTop: 6, marginLeft: 5, alignItems: "flex-end"}}>{this.convertTimestampToCurrentTime(comment.TimeStamp)}</Text>
                </Block>
                <Block style={{paddingHorizontal: 35, marginBottom: 5}} row>
                    <Text bold color={theme.COLORS.PRIMARY}>{`${i18n.t('PlaceDetail.commentRating')}: ${comment.Rating.toFixed(1)}/10`}</Text>
                    <Icon
                        size={14}
                        style={{marginLeft: 5}}
                        color={'#e6e600'}
                        name="star"
                        family="AntDesign"
                    />
                </Block>
                <Block style={{paddingHorizontal: 35}} row>
                    {!comment.Comment && <Text color={theme.COLORS.MUTED}>No comment</Text>}
                    {!!comment.Comment && <Text>{ showAll || comment.Comment.length <= MAXIMUM_CHARACTER_SHOW ? comment.Comment : `${comment.Comment.slice(0, MAXIMUM_CHARACTER_SHOW)} ...`}</Text> }
                </Block>
            </Block>
        );
    }
}

Comment.propTypes = {
}

Comment.defaultProps = {
    showAll: true
}

const styles = StyleSheet.create({
    commentAvatar: {
        height: 30,
        width: 30,
        borderRadius: 15,
    },
});

export default withNavigation(Comment);