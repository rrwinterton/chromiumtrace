function multiplyMatrices(matrixA, matrixB) {
    if (matrixA.length !== matrixB.length) {
      throw new Error("check dimensions");
    }
  
    const n = matrixA.length;
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
      result[i] = new Array(n).fill(0);
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
  
    return result;
  }
  
  //
  function doWork() {
  const matrixA = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
  const matrixB = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
  
  traces = getTraceFunctions([0x99, 0x5577]);
  traces[0]();
  const result = multiplyMatrices(matrixA, matrixB);
  traces[1]();
  console.log(result);
  }