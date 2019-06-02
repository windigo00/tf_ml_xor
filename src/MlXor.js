
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

    createModel()
    {
        // Create a sequential model
        this.model = this.tf.sequential();

        // Add a single hidden layer
        this.model.add(this.tf.layers.dense({units: 5, inputShape: 2, activation: 'tanh' }));

        // Add an output layer
        this.model.add(this.tf.layers.dense({units: 1, activation: 'sigmoid'}));

        // Prepare the model for training.
        this.model.compile({
            optimizer: this.tf.train.sgd(0.2),
            loss: this.tf.losses.meanSquaredError,
            metrics: ['mse'],
        });
    }

    async trainWith(data, callbacks)
    {
        this.callbacks = callbacks;
        //prepare data
        var data = this.prepareData(data);
        //train model
        return await this.trainModel(data.inputs, data.labels);
    }

    prepareInput(data)
    {
        return this.tf.tidy(() => {
            return this.tf.tensor2d(data);
        });
    }
    prepareData(data)
    {
        return this.tf.tidy(() => {
            return {
                inputs: this.tf.tensor2d(data.inputs),
                labels: this.tf.tensor2d(data.labels),
            };
        });
    }

    async trainModel(inputs, labels)
    {

        const batchSize = 100;
        const epochs = 10;
        var cfg = {
            batchSize,
            epochs,
            shuffle: true
        };
        if (this.callbacks) {
            cfg.callbacks = this.callbacks;
        }
        return await this.model.fit(inputs, labels, cfg);
    }

    predict(input)
    {
        return this.model.predict(input);
    }
}