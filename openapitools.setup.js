var download = require('file-download');
var fs = require('fs');
var outputDirectoryPath = './generated';
var env = undefined;

var processArguments = function (argument) {
  var param = argument.split('=');
  if (param.length > 1) {
    var key = param[0];
    var val = param[1];
    if (key === 'env') env = val;
  }
};

process.argv.forEach(processArguments);

if (!env) throw 'env is required';

var microServiceHosts = {
  'api-external-svc': {
    dev: 'http://20.75.16.59',
    qas: 'http://20.22.37.36',
    prd: 'https://vendas.dpk.com.br/api-external',
  },
  'dpk-customer-svc': {
    dev: 'http://20.85.106.68',
    qas: 'http://20.94.13.185',
    prd: 'https://vendas.dpk.com.br/dpk-customer',
  },
  'kdp-customer-svc': {
    dev: 'http://20.7.80.200',
    qas: 'http://20.69.201.220',
    prd: 'https://vendas.portalkdp.com.br/kdp-customer',
  },
  'dpk-financial-svc': {
    dev: 'http://20.98.232.213',
    qas: 'http://20.22.87.147',
    prd: 'https://vendas.dpk.com.br/dpk-financial',
  },
  'kdp-financial-svc': {
    dev: 'http://20.7.175.110',
    qas: 'http://20.36.153.139',
    prd: 'https://vendas.portalkdp.com.br/kdp-financial',
  },
  'dpk-order-svc': {
    dev: 'http://172.177.110.227',
    qas: 'http://52.167.75.203',
    prd: 'https://vendas.dpk.com.br/dpk-order',
  },
  'kdp-order-svc': {
    dev: 'http://20.122.124.26',
    qas: 'http://20.44.86.45',
    prd: 'https://vendas.portalkdp.com.br/kdp-order',
  },
  'dpk-price-svc': {
    dev: 'http://4.152.8.104',
    qas: 'http://20.72.118.161',
    prd: 'https://vendas.dpk.com.br/dpk-price',
  },
  'kdp-price-svc': {
    dev: 'http://20.44.87.1',
    qas: 'http://20.96.232.39',
    prd: 'https://vendas.portalkdp.com.br/kdp-price',
  },
  'dpk-product-svc': {
    dev: 'http://20.75.42.209',
    qas: 'http://20.72.117.32',
    prd: 'https://vendas.dpk.com.br/dpk-product',
  },
  'kdp-product-svc': {
    dev: 'http://20.80.201.86',
    qas: 'http://20.72.118.58',
    prd: 'https://vendas.portalkdp.com.br/kdp-product',
  },
  'dpk-shipping-svc': {
    dev: 'http://40.65.236.8',
    qas: 'http://20.72.116.139',
    prd: 'https://vendas.dpk.com.br/dpk-shipping',
  },
  'kdp-shipping-svc': {
    dev: 'http://52.177.52.243',
    qas: 'http://20.72.117.2',
    prd: 'https://vendas.portalkdp.com.br/kdp-shipping',
  },
  'portalkd-auth-svc': {
    dev: 'http://20.85.97.53',
    qas: 'http://52.167.81.64',
    prd: 'https://vendas.dpk.com.br/portalkd-auth-prd',
  },
  'dpk-warranty-svc': {
    dev: 'http://20.1.254.167',
    qas: '',
    prd: 'http://vendas.dpk.com.br/kdp-warranty.prd',
  },
  'kdp-warranty-svc': {
    dev: 'http://20.1.255.143',
    qas: '',
    prd: 'http://vendas.dpk.com.br/dpk-warranty.prd',
  },
};

Object.entries(microServiceHosts).forEach(function (entry) {
  var name = entry[0];
  var url = entry[1][env] + '/swagger/v1/swagger.json';

  if (!fs.existsSync(outputDirectoryPath)) {
    fs.mkdirSync(outputDirectoryPath);
  }

  var options = {
    directory: outputDirectoryPath,
    filename: name + '.json',
  };

  download(url, options, function (err) {
    console.log(env, name, url);
    if (err) throw err;
    console.log(name, 'swagger.json downloaded!');
  });
});
