FROM continuumio/miniconda3:4.11.0
ENV ANVIO_VERSION "7.1_main_0522"

SHELL ["/bin/bash", "--login", "-c"]

RUN conda config --env --add channels bioconda && \
conda config --env --add channels conda-forge

# Create a conda environment for anvi'o, activate it, and make sure it will
# always be activated
RUN conda create -n anvio-dev python=3.7 && \
conda init bash && \
conda activate anvio-dev && \
echo "conda activate anvio-dev" >> ~/.bashrc

# Activate environment variables
ENV PATH /opt/conda/envs/anvio-dev/bin:$PATH && \
CONDA_DEFAULT_ENV anvio-dev && \
CONDA_PREFIX /opt/conda/envs/anvio-dev

# fun stuff
RUN conda install -y conda-build && \
conda install -y conda-verify && \
conda install -y nano && \
conda install -y -c conda-forge "mamba >=0.24.0"

# Setup the environment
RUN mamba install -y -c bioconda -c conda-forge python=3.7 \
        sqlite prodigal idba mcl muscle=3.8.1551 hmmer diamond \
        blast megahit spades bowtie2 tbb=2020.3 bwa graphviz \
        "samtools >=1.9" trimal iqtree trnascan-se fasttree vmatch \
        r-base r-tidyverse r-optparse r-stringi r-magrittr

# try this, too. it may also fail to install. which is OK:
RUN mamba install -y -c bioconda fastani

# install qvalue
RUN Rscript -e 'install.packages("BiocManager", repos="https://cran.rstudio.com"); BiocManager::install("qvalue")'

RUN mamba install -y -c bioconda bioconductor-qvalue

RUN export CC=/usr/bin/clang && export CXX=/usr/bin/clang++

RUN apt-get -y update && \
apt-get install git && \
apt-get install vim util-linux -yy

#Install the Anvio Repository and checkout the branch

RUN mkdir -p ~/github && \
cd ~/github/ && \
git clone https://github.com/merenlab/anvio.git --recursive && \
cd ~/github/anvio/ && \ 
git submodule update --init --recursive && \
git checkout anvi-run-batch && \
git config pull.rebase false && \
pip install -r requirements.txt

RUN echo "echo ${CONDA_PREFIX}/etc/conda/activate.d/anvio.sh" >> ~/.bashrc && \
echo "export PYTHONPATH=\$PYTHONPATH:~/github/anvio/" >> ~/.bashrc && \
echo "export PATH=\$PATH:~/github/anvio/bin:~/github/anvio/sandbox" >> ~/.bashrc && \
echo "echo -e 'Updating from anvio GitHub (press CTRL+C to cancel) ...'" >> ~/.bashrc && \
echo "cd ~/github/anvio && git pull && cd -" >> ~/.bashrc

# Cutify the environment
RUN echo "export PS1=\"\[\e[0m\e[47m\e[1;30m\] :: anvio v$ANVIO_VERSION :: \[\e[0m\e[0m \[\e[1;34m\]\]\w\[\e[m\] \[\e[1;32m\]>>>\[\e[m\] \[\e[0m\]\"" >> /root/.bashrc

CMD /bin/bash -l