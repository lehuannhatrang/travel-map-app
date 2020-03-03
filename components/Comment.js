import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { argonTheme } from '../constants';
import Icon from './Icon';


class Comment extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { comment } = this.props;
        return (
            <Block style={{marginBottom: 20}}>
                <Block row>
                    <Image
                    source={{ uri: comment.author.avatar }}
                    resizeMode="cover"
                    style={styles.commentAvatar}
                    />
                    <Text bold color="#525F7F" style={{paddingTop: 6, marginLeft: 5}}>{comment.author.name}</Text>
                    <Text color={theme.COLORS.MUTED} style={{paddingTop: 6, marginLeft: 5, alignItems: "flex-end"}}>{comment.createdAt}</Text>
                </Block>
                <Block style={{paddingHorizontal: 35}} row>
                    <Text>{comment.comment}</Text>
                </Block>
            </Block>
        );
    }
}

Comment.propTypes = {
}

const styles = StyleSheet.create({
    commentAvatar: {
        height: 30,
        width: 30,
        borderRadius: 15,
    }
});

export default withNavigation(Comment);