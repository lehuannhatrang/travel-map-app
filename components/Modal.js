import React from 'react';
import { 
    Modal, 
    Text, 
    TouchableHighlight, 
    View, 
    Alert 
} from 'react-native';

class CustomModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        }
    }

    render(){
        return (
            <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            style={{justifyContent: 'center', alignItems: 'center'}}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
                <View flex center>
                    <Text text10>Center of Attention</Text>
                </View>
            </Modal>
        )
    }
}

CustomModal.defaultProps = {
    modalVisible: false
}

export default CustomModal;