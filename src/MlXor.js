
export default class MlXor {
    /**
     * {Tensorflow} tfLib
     */
    constructor(tfLib)
    {
        this.tf = tfLib;
        this.createModel();
    }

    get Model()
    {
        if (!this.model) {
            this.createModel();
        }
        return this.model;
    }

    set Model(value)
    {
        this.model = value;
    }

    /**
     * Prepare and compile model
     */
    createModel()
    {
        // Create a sequential model
        this.model = this.tf.sequential();

        // Add a single hidden layer
        this.model.add(this.tf.layers.dense({units: 5, inputShape: 2, activation: 'sigmoid' }));

        // Add a single hidden layer
//        this.model.add(this.tf.layers.dense({units: 2, activation: 'softmax' }));

        // Add an output layer
        this.model.add(this.tf.layers.dense({units: 1, activation: 'sigmoid'}));

        // Prepare the model for training.
        this.model.compile({
            optimizer: this.tf.train.adam(0.1),
            loss: this.tf.losses.logLoss,
//            loss: this.tf.losses.meanSquaredError,
            metrics: ['mse'],
        });
    }
    /**
     * initiate model training with own data
     *
     * {array} data
     * {object} TF.fit callbacks
     */
    async trainWith(data, callbacks)
    {
        this.callbacks = callbacks;
        //prepare data
        data = this.prepareData(data);
        //train model
        await this._trainModel(data.inputs, data.labels);
        this.tf.dispose(data.inputs);
        this.tf.dispose(data.labels);
        return 1;
    }

    /**
     *
     */
    prepareInput(data)
    {
//        return this.tf.tidy(() => {
            return this.tf.tensor2d(data);
//        });
    }
    prepareData(data)
    {
//        return this.tf.tidy(() => {
            return {
                inputs: this.tf.tensor2d(data.inputs),
                labels: this.tf.tensor2d(data.labels),
            };
//        });
    }

    async _trainModel(inputs, labels)
    {

        const batchSize = 10;
        const epochs = 1000;
        var cfg = {
            batchSize,
            epochs,
            shuffle: true
        };
        if (this.callbacks) {
            cfg.callbacks = this.callbacks;
        }
        await this.model.fit(inputs, labels, cfg);
        return 1;
    }
    /**
     * query result from model
     */
    predict(input)
    {
        return this.model.predict(input);
    }
}