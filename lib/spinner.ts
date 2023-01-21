import ora from 'ora';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let computer = false;

// eslint-disable-next-line no-return-assign
export const isAllowed = (flag: boolean | undefined | null) =>
  flag ? (computer = true) : false;

const spinner = ora({
  // make a singleton so we don't ever have 2 spinners
  spinner: 'dots',
  isSilent: computer,
});

export const updateSpinnerText = (message: string) => {
  if (!computer) {
    if (spinner.isSpinning) {
      spinner.text = message;
      return;
    }
    spinner.start(message);
  }
};

export const stopSpinner = () => {
  if (!computer) {
    if (spinner.isSpinning) {
      spinner.stop();
    }
  }
};
export const spinnerError = (message?: string) => {
  if (!computer) {
    if (spinner.isSpinning) {
      spinner.fail(message);
    }
  }
};
export const spinnerSuccess = (message?: string) => {
  if (!computer) {
    if (spinner.isSpinning) {
      spinner.succeed(message);
    }
  }
};
export const spinnerInfo = (message: string) => {
  if (!computer) {
    spinner.info(message);
  }
};
