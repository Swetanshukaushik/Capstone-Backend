const createFactory = function(elementModel){   //create new
    return async function(req,res){
        try {
            const elementDetails = req.body;

            const element = await elementModel.create(elementDetails);

            res.status(200).json({
                status: 'success',
                message: element
            });
        } catch(err) {
            res.status(500).json({
                status: 'failure',
                message: err.message
            });
        }
    }
}

const getByIdFactory = function(elementModel){  //get by id
    return async function (req, res) {
        try {
            const elemenId = req.params.elemendId;

            const element = await elementModel.findById(elemenId);
            
            if(element.length === 0){
                throw new Error(`Element with ${elemenId} not found`);
            }

            res.status(200).json({
                status: 'success',
                message: 'Created Successfully'
            });
        } catch(err) {
            res.status(500).json({
                status: 'failure',
                message: err.message
            });
        }
    }
}

const deleteByIdFactory = (ElementModel) => {
    return async function (req, res) {
        try{
            const elemendId = req.params.elemenId;
            const element = await ElementModel.deleteById(elemendId);

            res.status(200).json({
                status: "Element deleted successfully",
                message: element
            });
        } catch (err) {
            res.status(500).json({
                status: "failure",
                message: err.message
            });
        }
    }
}

const getAllFactory = (ElementModel) => {
    return async function (req, res) {
        try{
            const elementDataStore = await ElementModel.find();
            if (elementDataStore.length == 0) {
                throw new Error("No elements are present")
            }
            res.status(200).json({
                status: "success",
                message: elementDataStore
            });
        } catch (err) {
            res.status(500).json({
                status: "failure",
                message: err.message
            });
        }
    }
}

module.exports = {createFactory, getByIdFactory, deleteByIdFactory, getAllFactory};
