import chalk from "chalk";
import cliSpinners from "cli-spinners";

const Error = (txt) => chalk.red(txt);
const Success = (txt) => chalk.green.bold(txt);
const Start = (txt) => chalk.bgBlack.yellow.bold(txt);
const Info = (txt) => chalk.blueBright.bold(txt);
const Magenta = (txt) => chalk.magentaBright.bold(txt);
const Banner = (txt) => chalk.cyanBright.bold(txt);
//cli loading spinner
const Spinner = (type, txt) => {
  const spinner = cliSpinners[type];
  const spinnerinterval = spinner.interval;
  const spinnerframe = spinner.frames;
  let index = 0;
  return setInterval(() => {
    process.stdout.write(Magenta(`[*]${txt}.....${spinner.frames[index]} `));
    process.stdout.cursorTo(0);
    if (index >= spinnerframe.length - 1) {
      index = 0;
    } else {
      index++;
    }
  }, spinnerinterval + 200);
};

export default { Error, Success, Start, Info, Banner, Spinner, Magenta };
