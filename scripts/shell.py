import subprocess


def uname(option: str):
    return subprocess.run(["uname", option], capture_output=True, text=True).stdout.strip()


def shell(command: str, cwd: str = None, check=True, env = None, executable=None):
    subprocess.run(command, cwd=cwd, shell=True, check=check, env=env, executable=executable)


def make(arg: str = None, cwd: str = None, env = None):
    if arg:
        shell(f'make {arg}', cwd=cwd, env=env)
    else:
        shell('make', cwd=cwd, env=env)
